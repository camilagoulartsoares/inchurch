import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './product.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../login/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-details',
  imports: [MatProgressSpinnerModule,MatIconModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetailsComponent implements OnInit {
  productId: string | null = null;
  productDetails: any = { selectedImage: '', images: [] };
  isEditingPrice: boolean = false;
  isEditingStock: boolean = false;
  isEditingCategory: boolean = false;
  isEditingBrand: boolean = false;
  isEditingRating: boolean = false;
  isEditing: boolean = false;
  isEditingTitle: boolean = false;
  editedTitle: string = '';
  isEditingDescription: boolean = false;
  editedDescription: string = '';
  imageLoaded: boolean = false;

  constructor(private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.getProductDetails(this.productId);
    }
  }

  getProductDetails(productId: string): void {
    this.productService.getProductById(productId)
      .subscribe(product => {
        this.productDetails = product;
        this.editedTitle = product.title;

        if (product.images.length > 0) {
          this.productDetails.selectedImage = product.images[0];
          this.imageLoaded = true;
        }
      });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  enableEditing() {
    this.isEditing = true;
    this.isEditingTitle = true;
  }



  saveChanges() {
    if (this.productId) {
      const updatedData = {
        title: this.editedTitle
      };

      this.productService.updateProduct(this.productId, updatedData)
        .subscribe(
          (updatedProduct) => {
            this.productDetails.title = updatedProduct.title;
            this.isEditing = false;
            this.isEditingTitle = false;
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Erro ao atualizar produto:', error);
          }
        );
    }

  }



  enableEditingTitle() {
    this.isEditingTitle = true;
  }

  saveTitle() {
    if (this.productId) {
      const updatedData = {
        title: this.editedTitle
      };

      this.productService.updateProduct(this.productId, updatedData)
        .subscribe(
          (updatedProduct) => {
            this.productDetails.title = updatedProduct.title;
            this.isEditingTitle = false;
          },
          (error) => {
            console.error('Erro ao atualizar produto:', error);
          }
        );
    }
  }

  cancelEditTitle() {
    this.editedTitle = this.productDetails.title;
    this.isEditingTitle = false;
  }


  openModal() {
    this.isEditing = true;
    this.editedTitle = this.productDetails.title;
    this.editedDescription = this.productDetails.description;

  }

  closeModal() {
    this.isEditing = false;
  }

  cancelEdit() {
    this.closeModal();
  }

  openEditModal(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Você precisa estar logado para editar o produto.');
      return;
    }
    // const dialogRef = this.dialog.open(EditModalComponent, {
    //   width: '500px',
    //   height: '270px',
    //   data: { title: this.productDetails.title, description: this.productDetails.description  }

    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.productDetails.title = result.title;
    //     this.productDetails.description = result.description;
    //   }
    // });
  }

  enableEditingDescription() {
    this.isEditingDescription = true;
  }

  saveDescription() {
    if (this.productId) {
      const updatedData = {
        description: this.editedDescription
      };

      this.productService.updateProduct(this.productId, updatedData)
        .subscribe(
          (updatedProduct) => {
            this.productDetails.description = updatedProduct.description;
            this.isEditingDescription = false;
          },
          (error) => {
            console.error('Erro ao atualizar produto:', error);
          }
        );
    }
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  cancelEditDescription() {
    this.editedDescription = this.productDetails.description;
    this.isEditingDescription = false;
  }
}
